const db = require("../db/knex");

exports.list = async(req,res,next) => {
    try {
        const id = req.params.u_id;
        const eva_id = await db("evauser").select("*").where("evauser.u_id",id).first()
        const list = await db("evauser")
            .leftJoin("users","evauser.u_id","users.u_id")
            .leftJoin("evaluation","evauser.eva_id","evaluation.eva_id")
            .leftJoin("topic","evaluation.t_id","topic.t_id")
            .select(
                "evaluation.eva_id",
                "evaluation.date_start",
                "evaluation.date_end",
                "evaluation.eva_id",
                "topic.t_id",
                "topic.t_name",
                "users.u_id",
                "users.u_name"
            )
            .where("evauser.eva_id",eva_id.eva_id)
            .where("evauser.evau_role","U")
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
