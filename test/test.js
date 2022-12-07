const mocha = require('mocha');
const {expect} = require('chai');
const cc = require("../controller/customerController")
describe("Login",()=>{
    it("Should return appropriate id",(done)=>{
        expect(cc("aadi","123123123")).to.equal(1);
        done();
    })
})
