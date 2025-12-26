import Notification from "../models/notification.model";

 export  const allnotification=async (req,res)=>{
	try{
		const userid=req.user._id;
		const notification=await Notification.find({to:userid}).sort({createdAt:-1}).populate({path:"from",select:"username profileimg"})
		await Notification.updateMany({to:userid},{read:true});
		res.status(201).json({message:"sucessfull all notification",data:notification});
	}catch(error){
        res.status(500).json({message:"internal server error"});
	}

}

 export  const deletenotification=async (req,res)=>{
   try{
	const userid=req.user._id;
	await Notification.deleteMany({to:userid});
	res.status(201).json({message:"delete sucessfully"});
	
   }catch(error){
	 res.status(500).json({message:"internal server error"});
   }
}