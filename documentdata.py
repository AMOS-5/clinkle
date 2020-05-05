from datetime import datetime

class DocumentData:

    def __init__(self, name: str, path: str, type: str, lang: str, size: int, createdAt: datetime):
        self.name = name
        self.path = path
        self.type = type
        self.lang = lang
        self.size = size
        self.createdAt = createdAt

    def as_dict(self):
        return {
            "name" : self.name,
            "path" : self.path,
            "type" : self.type,
            "lang" : self.lang,
            "size" : self.size,
            "createdAt" : self.createdAt.ctime()
        }