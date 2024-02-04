function ResponseMock(){
  this.status = jest.fn(() => this);
  this.send = jest.fn(() => this);
}

module.exports = ResponseMock;
