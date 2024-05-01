export const errorMiddleware = (err,req,res,next)=>{
    err.message=err.message ||"Internal server Error"
    err.statusCode= err.statusCode||500
    res.status(err.statusCode).json({
        sucess:false,
        message:err.message
    })

}

export const asyncError =(passedFUnction)=>(req,res,next)=>{
Promise.resolve(passedFUnction(req,res,next)).catch(next);
}