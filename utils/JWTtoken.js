const sendToken = (user,statusCode,res)=>{
    const token = user.getJWTToken();
  
    // options for cookie
    const options = {
      expires: new Date(
        Date.now() + 50000000000 * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    res.status(statusCode).cookie("token", token,{maxAge: 60 * 60000*60}).json({
      success: true,
      user,
      token,
    });
}

export default sendToken;