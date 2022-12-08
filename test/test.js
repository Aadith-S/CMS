const mocha = require('mocha');
const {expect} = require('chai');
const cc = require("../controller/customerController")
describe("Login",()=>{
    it("Should return appropriate id",(done)=>{
        expect(cc.authentication("aadi","123123123").dataValues.user_id).to.equal(1);
        done();
    })
})
console.log(cc.authentication("aadi","123123123"))
