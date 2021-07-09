pragma solidity >=0.5.0;

contract Decentragram {
  address payable _author;

  string public name ="decentragram";

  // store posts
  uint public imageCount = 0 ;
  mapping(uint => Image) public images;

  struct Image{
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
  }

  event imageCreated (uint id, string hash , string description , uint tipAmount , address payable author);
  event imageTiped (uint id, string hash , string description , uint tipAmount , address payable author);

  
  // create images 

  function uploadImage(string memory _imgHash , string memory _description) public {
    require(bytes(_description).length >0 ,"description cannot be null");
    require(bytes(_imgHash).length >0 ,"invalid image");
    require(msg.sender != address(0x0),"invalid user");
    //increament image id
    imageCount ++;
    
    //add image to contract
    images[imageCount] = Image(imageCount,_imgHash,_description, 0 , _author) ;
  
    emit imageCreated(imageCount, _imgHash, _description, 0  , _author);

  }

  // tip images 
  function tipImageOwner(uint _id ) public payable {
    //make user id is valid
    require(_id >0 && _id <=imageCount , "invalid image");
    
    //fetch the image 
    Image memory _image = images[_id];

    //fetch the image owner
    _author = _image.author;

    //pay the author by sending the tip
    _author.transfer(msg.value);

    //increment the tip amount
    _image.tipAmount = _image.tipAmount + msg.value;

    //update the image 
    images[_id] = _image;

   emit imageTiped(_id, _image.hash, _image.description, _image.tipAmount  , _author);

  }
  

}