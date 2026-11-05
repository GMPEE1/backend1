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
        const t_id = req.params.t_id;
        const topic = await db("topic").select("*").where("topic.t_id",t_id)
        const list = await db("indicator")
            .leftJoin(
                "score",
                "indicator.sc_id",
                "score.sc_id"
            )
            .select(
                "indicator.ind_id",
                "indicator.ind_name",
                "indicator.ind_score",
                "score.score_step1",
                "score.score_step2",
                "score.score_step3",
                "score.score_max",
            )
            .where("indicator.t_id",t_id)
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
        const t_id = req.params.t_id;
        const list = await db("indicator")
            .leftJoin(
                "score",
                "indicator.sc_id",
                "score.sc_id"
            )
            .select(
                "indicator.ind_id",
                "indicator.ind_name",
                "indicator.ind_score",
                "score.score_max",
            )
            .where("indicator.ind_id",id).where("indicator.t_id",t_id).first()
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

exports.updateInd = async(req,res,next) => {
    try {
        const id = req.params.ind_id;
        const t_id = req.params.t_id;
        const { ind_name, ind_score, score_max } = req.body;
        const score = {score_max};

        if(!ind_score == 0){
            score.score_step1 = score_max / 4 * 1,
            score.score_step2 = score_max / 4 * 2,
            score.score_step3 = score_max / 4 * 3
        } else {
            score.score_step1 = 0,
            score.score_step2 = 0,
            score.score_step3 = 0
        }

        const update = await db.transaction(async (trx) => {
            await trx("indicator").update({ind_name, ind_score}).where("indicator.ind_id",id).where("indicator.t_id",t_id)
            const sc_id = trx("indicator").select("indicator.sc_id").where("indicator.ind_id",id).where("indicator.t_id",t_id).first()
            await trx("score").update(score).where("score.sc_id",sc_id)

            return sc_id;
        }) 

        if(!update) return res.json({massage:"อัพเดทข้อมูลไม่ได้ หรือ ข้อมูลไม่ครบ"})

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
        const id = req.params.ind_id;
        const t_id = req.params.t_id;
        const score = await db("indicator").select("indicator.sc_id").where("indicator.ind_id",id).where("indicator.t_id",t_id).first()
        await db("score").where("score.sc_id",score.sc_id).delete()
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
        const score = {score_max};

        if(!ind_score == 0){
            score.score_step1 = score_max / 4 * 1,
            score.score_step2 = score_max / 4 * 2,
            score.score_step3 = score_max / 4 * 3
        } else {
            score.score_step1 = 0,
            score.score_step2 = 0,
            score.score_step3 = 0
        }

        const create = await db.transaction(async (trx) => {
            const sc_id = await trx("score").insert(score)
            const indicator = await trx("indicator").insert({ind_name, ind_score, t_id, sc_id})

            return indicator;
        }) 

        if(!create) return res.json({massage:"เพิ่มข้อมูลไม่ได้ หรือ ข้อมูลไม่ครบ"})

        res.status(201).json({
            success: true,
            message: "เพิ่มข้อมูลเร็จเรียบร้อย"
        })
    } catch (e) {
        next(e);
    }
}