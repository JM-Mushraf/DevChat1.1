export const sendToken=(user,statusCode,res)=>{
    const token=user.getJWT();
    //option for cookie

    const options={
        expires:new Date(
            Date.now() + 2 * 24 * 60 * 60 * 1000
        ),
        httpOnly:true,
        secure:true,
    }
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        token,
        user
    })
}