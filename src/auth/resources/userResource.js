import {baseUrl} from "../../common/config/constant.config"
class getUserResource {
    
    constructor(data) {
     
        this._id = data._id;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.email = data.email;
        this.countrycode = data.countrycode;
        this.mobilenumber = data.mobilenumber;
        this.location = data.location;
        this.zipcode = data.zipcode;
        this.termCondition = data.termCondition;
        this.profileImage = data.profileImage ? baseUrl(`/profile/${data.profileImage}`) : null
    }
}

export default getUserResource;