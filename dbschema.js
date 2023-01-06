const mongoose=require('mongoose')
const validator=require('validator')

var userSchema=new mongoose.Schema({
    Customer_Name:{type:'string',required:'true'},
    Date:{type:'Date',
          required:'true',
            
        },
    Start_Time:{type:'string',
                required:'true',
                validate:(value)=>{
                    return validator.isISO8601(value)
                }},
    End_Time:{type:'string',
            required:'true'
            validate:(value)=>{
                return validator.isISO8601(value)
            }
            },
    room_id:{type:'string', required:'true'},
    booked:{type:'boolean'}
})
let usersModel=mongoose.model('roombook',userSchema);
module.exports={mongoose,usersModel}