export const findOne = async(Model,query)=>{
    return await Model.findOne(query);
}

export const findById =async (Model,id,populate="" )=>{

if(populate){
    return await Model.findById(id).populate(populate)
}
    return await Model.findById(id);
}

export const findAll = async (Model,query)=>{
    return await Model.find()
}