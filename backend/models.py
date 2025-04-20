from app import db

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    razao_social = db.Column(db.String(150), nullable=False)
    cnpj = db.Column(db.String(14), unique=True, nullable=False)
    email = db.Column(db.String(120))
    whatsapp = db.Column(db.String(20))
    obligations = db.relationship('Obligation', backref='client', lazy=True)

class Obligation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    descricao = db.Column(db.String(150), nullable=False)
    data_vencimento = db.Column(db.DateTime, nullable=False)
    valor = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False)