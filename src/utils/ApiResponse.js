class ApiResponse extends Response{
    constructor(stausCode, data, message = "success"){
        this.stausCode = stausCode
        this.data = data
        this.message = message
        this.success = stausCode < 400
    }
}