const { assert } = require('chai')

const Decentragram = artifacts.require('./Decentragram.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Decentragram', ([deployer, author, tipper]) => {
  let decentragram

  before(async () => {
    decentragram = await Decentragram.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await decentragram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await decentragram.name()
      assert.equal(name, 'Decentragram')
    })
  })

// test for images function 
  
  describe('images', async => {
    let result 
    const hash ='abc123'

    before(async () => {
      result = await decentragram.uploadImage(hash ,"image Description" , {from:author}) //author is coming from above it,s js object telling who's calling this , he is author
      imageCount = await decentragram.imagecount()
    })


    it('create images' , async()=>{
      //success

      assert.equal(imageCount ,1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber() , imageCount.toNumber(),' id is correct')
      assert.equal(event.hash ,hash,' Hash is correct')
      assert.equal(event.description ,'Image description' , ' id is correct')
      assert.equal(event.tipAmount , '0' , 'i tipAmount is correct')
      assert.equal(event.author , author ,' author is correct')
      

      //failur :iimage must have hash
      await decentragram.uploadImage("", 'Image description' ,{from:author}).shoud.be.rejected;

      //fail :image must have description 
      await decentragram.uploadImage('Image hash' , '',{from:author}).shoud.be.rejected;
    })

    //check from struct 

    it('list images' , async()=> {
      const image = await decentragram.images(imageCount)
      assert.equal(event.id.toNumber() , imageCount.toNumber(),' id is correct')
      assert.equal(event.hash ,hash,' Hash is correct')
      assert.equal(event.description ,'Image description' , ' id is correct')
      assert.equal(event.tipAmount , '0' , 'i tipAmount is correct')
      assert.equal(event.author , author ,' author is correct')
      
    })

    it('allows users to tip images', async () => {
      // Track the author balance before purchase
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

      result = await decentragram.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

      // SUCCESS
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.description, 'Image description', 'description is correct')
      assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')

      // Check that author received funds
      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      let tipImageOwner
      tipImageOwner = web3.utils.toWei('1', 'Ether')
      tipImageOwner = new web3.utils.BN(tipImageOwner)

      const expectedBalance = oldAuthorBalance.add(tipImageOwner)

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

      // FAILURE: Tries to tip a image that does not exist
      await decentragram.tipImageOwner(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
    })
  })
})
  