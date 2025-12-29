function Loginvalidter({username,password}){
	 const errors = {
		success: true,
  message: "",
  type: "",
	 };

  if (!username.trim()) {
    return {success:false,message:"usename cannot be empty",type:"username"}
  } else if (username.length < 3) {
    return  {success:false,message:"usename length must be greate than 3",type:"username"}
  }

  if (!password.trim()) {
   return {success:false,message:"password cannot be empty",type:"password"}
  } else if (password.length < 6) {
   return {success:false,message:"usename length must be greater than 6",type:"password"}
  }
  return errors;
}

export default Loginvalidter