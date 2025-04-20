from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import requests
import os
from datetime import datetime, timedelta
import xml.etree.ElementTree as ET

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contabil.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelos
class Cliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    razao_social = db.Column(db.String(100), nullable=False)
    cnpj = db.Column(db.String(14), nullable=False, unique=True)
    email = db.Column(db.String(100))
    whatsapp = db.Column(db.String(20))

class Contabilidade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(10), nullable=False)  # "PF" ou "PJ"
    cpf_cnpj = db.Column(db.String(14), nullable=False, unique=True)
    nome_razao_social = db.Column(db.String(100), nullable=False)
    crc = db.Column(db.String(20))
    celular_whatsapp = db.Column(db.String(20))
    email = db.Column(db.String(100))

class Funcionario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(11), unique=True)
    celular_whatsapp = db.Column(db.String(20))

class Obrigacao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)
    descricao = db.Column(db.String(200), nullable=False)
    data_vencimento = db.Column(db.Date, nullable=False)
    valor = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='Pendente')

# Inicializar o banco
with app.app_context():
    db.create_all()

# Configurações para o cálculo de ICMS
NS = {'nfe': 'http://www.portalfiscal.inf.br/nfe'}
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def calcular_vencimento(dh_emi):
    data_emissao = datetime.strptime(dh_emi[:10], '%Y-%m-%d')
    segundo_mes = data_emissao.replace(day=1) + timedelta(days=60)
    vencimento = segundo_mes.replace(day=15)
    if vencimento.weekday() == 5:
        vencimento += timedelta(days=2)
    elif vencimento.weekday() == 6:
        vencimento += timedelta(days=1)
    return vencimento.strftime('%d/%m/%Y')

def process_xml(file_path):
    try:
        tree = ET.parse(file_path)
        root = tree.getroot()
        nNF = root.find('.//nfe:nNF', NS).text
        dh_emi = root.find('.//nfe:dhEmi', NS).text
        cnpj_dest = root.find('.//nfe:dest/nfe:CNPJ', NS).text
        nome_dest = root.find('.//nfe:dest/nfe:xNome', NS).text
        uf_emit = root.find('.//nfe:emit/nfe:enderEmit/nfe:UF', NS).text
        itens = []
        alertas = []
        if uf_emit == "MG":
            return None, None, None, None, itens, alertas
        for det in root.findall('.//nfe:det', NS):
            item_num = det.attrib['nItem']
            cfop = det.find('.//nfe:prod/nfe:CFOP', NS).text
            if cfop not in ["6101", "6102"]:
                continue
            icms = det.find('.//nfe:ICMS', NS)
            vBC = float(icms.find('.//nfe:vBC', NS).text) if icms.find('.//nfe:vBC', NS) is not None else 0.0
            vICMS = float(icms.find('.//nfe:vICMS', NS).text) if icms.find('.//nfe:vICMS', NS) is not None else 0.0
            pICMS = float(icms.find('.//nfe:pICMS', NS).text) if icms.find('.//nfe:pICMS', NS) is not None else 0.0
            if pICMS not in [4.0, 12.0]:
                alertas.append(f"Nota {nNF}: Alíquota {pICMS}% diferente de 4% ou 12%.")
            itens.append({'Item': item_num, 'CFOP': cfop, 'vBC': vBC, 'vICMS': vICMS, 'pICMS': pICMS})

        cliente = Cliente.query.filter_by(cnpj=cnpj_dest).first()
        if not cliente:
            cliente = Cliente(cnpj=cnpj_dest, razao_social=nome_dest)
            db.session.add(cliente)
            db.session.commit()

        return nNF, cnpj_dest, nome_dest, dh_emi, itens, alertas
    except Exception as e:
        return None, None, None, None, [], []

def calculate_icms_diff_by_note(itens_by_note):
    resultados = {}
    total_geral_diferenca = 0.0
    for (cnpj_dest, nome_dest), notas in itens_by_note.items():
        cliente_resultados = []
        total_cliente = 0.0
        for nota in notas:
            nNF, dh_emi, itens = nota['nNF'], nota['dh_emi'], nota['itens']
            if not itens:
                continue
            grouped = {}
            for item in itens:
                pICMS = item['pICMS']
                if pICMS not in grouped:
                    grouped[pICMS] = {'vBC_total': 0.0, 'vICMS_total': 0.0}
                grouped[pICMS]['vBC_total'] += item['vBC']
                grouped[pICMS]['vICMS_total'] += item['vICMS']
            nota_resultados = []
            total_diferenca_nota = 0.0
            for pICMS, totals in grouped.items():
                vBC_total = totals['vBC_total']
                vICMS_total = totals['vICMS_total']
                nova_base_icms = (vBC_total - vICMS_total) / 0.82
                icms_mg = nova_base_icms * 0.18
                diferenca = icms_mg - vICMS_total
                total_diferenca_nota += diferenca
                total_cliente += diferenca
                total_geral_diferenca += diferenca
                nota_resultados.append({
                    'pICMS': f"{pICMS:.2f}",
                    'vBC_total': f"{vBC_total:.2f}",
                    'vICMS_total': f"{vICMS_total:.2f}",
                    'icms_mg': f"{icms_mg:.2f}",
                    'diferenca': f"{diferenca:.2f}"
                })

            cliente = Cliente.query.filter_by(cnpj=cnpj_dest).first()
            if cliente:
                vencimento = datetime.strptime(calcular_vencimento(dh_emi), '%d/%m/%Y')
                obrigacao = Obrigacao(
                    cliente_id=cliente.id,
                    descricao=f"Diferença ICMS-MG - Nota {nNF}",
                    data_vencimento=vencimento,
                    valor=total_diferenca_nota
                )
                db.session.add(obrigacao)
                db.session.commit()

            cliente_resultados.append({
                'nNF': nNF,
                'dh_emi': dh_emi,
                'vencimento': calcular_vencimento(dh_emi),
                'dados': nota_resultados,
                'total_diferenca_nota': f"{total_diferenca_nota:.2f}"
            })
        resultados[(cnpj_dest, nome_dest)] = {
            'notas': cliente_resultados,
            'total_cliente': f"{total_cliente:.2f}"
        }
    return resultados, f"{total_geral_diferenca:.2f}"

# Rotas
@app.route('/consulta-cnpj/<cnpj>')
def consulta_cnpj(cnpj):
    token = os.getenv('RECEITAWS_TOKEN', 'your-token-here')
    url = f"https://receitaws.com.br/v1/cnpj/{cnpj}"
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return jsonify(response.json())
    return jsonify({'error': 'Erro ao consultar CNPJ'}), 500

@app.route('/clientes', methods=['GET', 'POST'])
def clientes():
    if request.method == 'POST':
        data = request.get_json()
        cliente = Cliente(
            razao_social=data['razao_social'],
            cnpj=data['cnpj'],
            email=data.get('email'),
            whatsapp=data.get('whatsapp')
        )
        db.session.add(cliente)
        db.session.commit()
        print(f"Cliente cadastrado: {cliente.razao_social}, CNPJ: {cliente.cnpj}")
        return jsonify({'message': 'Cliente cadastrado com sucesso!'}), 201
    
    # Listagem de clientes
    clientes = Cliente.query.all()
    clientes_json = [{
        'id': c.id,
        'razao_social': c.razao_social,
        'cnpj': c.cnpj,
        'email': c.email,
        'whatsapp': c.whatsapp
    } for c in clientes]
    print(f"Retornando lista de clientes: {clientes_json}")
    return jsonify(clientes_json)

@app.route('/contabilidades', methods=['POST'])
def cadastrar_contabilidade():
    data = request.get_json()
    contabilidade = Contabilidade(
        tipo=data['tipo'],
        cpf_cnpj=data['cpf_cnpj'],
        nome_razao_social=data['nome_razao_social'],
        crc=data.get('crc'),
        celular_whatsapp=data.get('celular_whatsapp'),
        email=data.get('email')
    )
    db.session.add(contabilidade)
    db.session.commit()
    return jsonify({'message': 'Contabilidade cadastrada com sucesso!'}), 201

@app.route('/funcionarios', methods=['POST'])
def cadastrar_funcionario():
    data = request.get_json()
    funcionario = Funcionario(
        nome=data['nome'],
        cpf=data.get('cpf'),
        celular_whatsapp=data.get('celular_whatsapp')
    )
    db.session.add(funcionario)
    db.session.commit()
    return jsonify({'message': 'Funcionário cadastrado com sucesso!'}), 201

@app.route('/calculo-icms', methods=['POST'])
def calculo_icms():
    print("Requisição recebida para /calculo-icms")
    if 'xmlInput' not in request.files:
        print("Erro: Nenhum arquivo 'xmlInput' encontrado na requisição")
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400
    files = request.files.getlist('xmlInput')
    print(f"Arquivos recebidos: {[file.filename for file in files]}")
    if not files or all(f.filename == '' for f in files):
        print("Erro: Nenhum arquivo selecionado ou arquivos vazios")
        return jsonify({'error': 'Nenhum arquivo selecionado'}), 400

    itens_by_note = {}
    alertas = []
    for file in files:
        if file and file.filename.endswith('.xml'):
            filename = file.filename
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            print(f"Salvando arquivo: {file_path}")
            file.save(file_path)
            try:
                nNF, cnpj_dest, nome_dest, dh_emi, itens, alertas_nota = process_xml(file_path)
                print(f"Arquivo processado: {filename}, nNF: {nNF}, Itens: {len(itens)}")
                if nNF and itens:
                    chave_cliente = (cnpj_dest, nome_dest)
                    if chave_cliente not in itens_by_note:
                        itens_by_note[chave_cliente] = []
                    itens_by_note[chave_cliente].append({'nNF': nNF, 'dh_emi': dh_emi, 'itens': itens})
                if alertas_nota:
                    alertas.extend(alertas_nota)
                    print(f"Alertas encontrados: {alertas_nota}")
            except Exception as e:
                print(f"Erro ao processar XML {filename}: {str(e)}")
                alertas.append(f"Erro ao processar {filename}: {str(e)}")
            finally:
                print(f"Removendo arquivo: {file_path}")
                os.remove(file_path)

    if not itens_by_note:
        print("Erro: Nenhum item com CFOP 6101 ou 6102 encontrado")
        return jsonify({'error': 'Nenhum item com CFOP 6101 ou 6102 encontrado', 'alertas': alertas}), 400

    try:
        resultados, total_geral_diferenca = calculate_icms_diff_by_note(itens_by_note)
        print("Cálculo de ICMS concluído com sucesso")
        return jsonify({'resultados': resultados, 'total_geral_diferenca': total_geral_diferenca, 'alertas': alertas})
    except Exception as e:
        print(f"Erro ao calcular ICMS: {str(e)}")
        return jsonify({'error': f'Erro ao calcular ICMS: {str(e)}', 'alertas': alertas}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)