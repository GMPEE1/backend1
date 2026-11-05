const db = require("../db/knex");

exports.list = async(req,res,next) => {
    try {
        const list = await db("topic").select("*")
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
        const list = await db("topic").select("*").where("topic.t_id",id)
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
        const { t_name } = req.body;
        await db("topic").insert({t_name})
        res.status(201).json({
            success: true,
            message: "เพิ่มข้อมูลเร็จเรียบร้อย"
        })
    } catch (e) {
        next(e);
    }
}

exports.listInd = async(req,res,next) => {
    try {
        const t_id = req.praram.t_id;
        const topic = await db("topic").select("*").where("topic.t_id",t_id)
        const list = await db("indicator").select("*").where("indicator.t_id",t_id)
        res.status(201).json({
            success: true,
            message: "ดึงข้อมูลสำเร็จเรียบร้อย",
            item: topic,list,
            total: list.length
        })
    } catch (e) {
        next(e);
    }
}

exports.editInd = async(req,res,next) => {
    try {
        const id = req.params.ind_id;
        const t_id = req.praram.t_id;
        const list = await db("indicator").select("*").where("indicator.ind_id",id).where("indicator.t_id",t_id)
        res.status(201).json({
            success: true,
            message: "ดึงข้อมูลสำเร็จเรียบร้อย",
            item: list
        })
    } catch (e) {
        next(e);
    }
}

exports.updateInd = async(req,res,next) => {
    try {
        const id = req.params.t_id;
        const t_id = req.praram.t_id;
        const data = req.body;
        await db("topic").update(data).where("indicator.ind_id",id).where("indicator.t_id",t_id)
        res.status(201).json({
            success: true,
            message: "อัพเดทข้อมูลเร็จเรียบร้อย"
        })
    } catch (e) {
        next(e);
    }
}

exports.deleteInd = async(req,res,next) => {
    try {
        const id = req.params.t_id;
        const t_id = req.praram.t_id;
        await db("indicator").where("indicator.ind_id",id).where("indicator.t_id",t_id).delete()
        res.status(201).json({
            success: true,
            message: "ลบข้อมูลเร็จเรียบร้อย"
        })
    } catch (e) {
        next(e);
    }
}

exports.createInd = async(req,res,next) => {
    try {
        const t_id = req.params.t_id;
        const { ind_name, ind_score, score_max } = req.body;

        const score = {
            score_max,
            score_step1: score_max * 1 / 4,
            score_step2: score_max * 2 / 4,
            score_step3: score_max * 3 / 4
        }

        const create = db.transaction((trx) => {
            const [sc_id] = trx("score").insert({score})
            const indicator = trx("indicator").insert({ind_name, ind_score, t_id, sc_id})

            return indicator;
        }) 

        if(!create) return res.json({massage:"ข้อมูลไม่ครบ"})

        res.status(201).json({
            success: true,
            message: "เพิ่มข้อมูลเร็จเรียบร้อย"
        })
    } catch (e) {
        next(e);
    }
}