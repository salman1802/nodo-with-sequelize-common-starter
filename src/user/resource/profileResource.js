import {baseUrl} from "../../common/config/constant.config"
class ProfileResource {
    
    constructor(profile) {
     
        this._id = profile._id;
        this.firstname = profile.firstname;
        this.lastname = profile.lastname;
        this.email = profile.email;
        this.countrycode = profile.countrycode;
        this.mobilenumber = profile.mobilenumber;
        this.location = profile.location;
        this.zipcode = profile.zipcode;
        this.termCondition = profile.termCondition;
        this.profileImage = profile.profileImage ? baseUrl(`/profile/${profile.profileImage}`) : null,
        this.isVerify = profile.isVerify

        
    }
}

export default ProfileResource;