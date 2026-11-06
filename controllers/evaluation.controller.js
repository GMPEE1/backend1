const db = require("../db/knex");

exports.list = async(req,res,next) => {
    try {
        const list = await db("evaluation").select("*")
        res.status(201).json({
            success: true,
            message: "ดึงข้อมูลสำเร็จเรียบร้อย",
            item: list,
            total: list.length
        })
    } catch (e) {
        next(e);
    }
}

exports.edit = async(req,res,next) => {
    try {
        const id = req.params.t_id;
        const list = await db("topic").select("*").where("topic.t_id",id).first()
        if(!list) return res.status(404).json({ success: false,message: "ไม่พบข้อมูล"})
        res.status(201).json({
            success: true,
            message: "ดึงข้อมูลสำเร็จเรียบร้อย",
            item: list
        })
    } catch (e) {
        next(e);
    }
}

exports.update = async(req,res,next) => {
    try {
        const id = req.params.t_id;
        const data = req.body;
        await db("topic").update(data).where("topic.t_id",id)
        res.status(201).json({
            success: true,
            message: "อัพเดทข้อมูลเร็จเรียบร้อย"
        })
    } catch (e) {
        next(e);
    }
}

exports.delete = async(req,res,next) => {
    try {
        const id = req.params.t_id;
        await db("topic").where("topic.t_id",id).delete()
        res.status(201).json({
            success: true,
            message: "ลบข้อมูลเร็จเรียบร้อย"
        })
    } catch (e) {
        next(e);
    }
}

exports.create = async(req,res,next) => {
    try {
        const eva = req.body;
        const evauser = req.body.evauser;
        await db.transaction(async(trx) => {
            const [eva_id] = await trx("evaluation")
                .insert({
                    date_start: eva.date_start,
                    date_end: eva.date_end,
                    t_id: eva.t_id,
                })
            const evauserdata = evauser.map((item)=>({
                ...item,
                eva_id: eva_id
            }));
            await trx("evauser").insert(evauserdata)
        })
        res.status(201).json({
            success: true,
            message: "เพิ่มข้อมูลเร็จเรียบร้อย"
        })
    } catch (e) {
        next(e);
    }
}
