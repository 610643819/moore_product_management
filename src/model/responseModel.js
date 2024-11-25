class BaseModel {
    constructor(data, massage) {
        if (typeof data === 'string') {
            this.massage = data;
            data = null
            massage = null
        }
        if (data && typeof data === 'object') {
            this.data = data;
        }
        if (massage) {
            this.massage = massage
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(data, massage) {
        console.log('8.SuccessModel')
        super(data, massage);
        this.code = 0;
    }
}

class ErrorModel extends BaseModel {
    constructor(data, massage) {
        console.log('SuccessModel')
        super(data, massage);
        this.code = -1;
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}
