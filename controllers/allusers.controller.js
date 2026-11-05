const db = require("../db/knex");

exports.list = async(req,res,next) => {
    try {
        const role = req.params.u_role;
        const list = await db("users").select("*").where("users.u_role",role)
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
        const role = req.params.u_role;
        const id = req.params.u_id;
        const list = await db("users").select("*").where("users.u_role",role).where("users.u_id",id)
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
        const role = req.params.u_role;
        const id = req.params.u_id;
        const data = req.body;
        await db("users").update(data).where("users.u_role",role).where("users.u_id",id)
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
        const role = req.params.u_role;
        const id = req.params.u_id;
        await db("users").where("users.u_role",role).where("users.u_id",id).delete()
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
        const { u_name, u_email, u_role } = req.body;
        await db("users").insert({ u_name, u_email, u_password: 12345678, u_role, u_pw_status: 0 })
        res.status(201).json({
            success: true,
            message: "เพิ่มข้อมูลเร็จเรียบร้อย"
        })
    } catch (e) {
        next(e);
    }
}

exports.updatePw = async(req,res,next) => {
    try {
        const id = req.params.u_id;
        const { u_password } = req.body;
        await db("users").update({ "users.u_password":u_password, "users.u_pw_status": 1 }).where("users.u_id",id)
        res.status(201).json({
            success: true,
            message: "เปลี่ยนรหัสผ่านเรียบร้อย"
        })
    } catch (e) {
        next(e);
    }
}

exports.resetPw = async(req,res,next) => {
    try {
        const id = req.params.u_id;
        await db("users").update({ "users.u_password":12345678, "users.u_pw_status": 0 }).where("users.u_id",id)
        res.status(201).json({
            success: true,
            message: "รีเซ็ตรหัสผ่านเรียบร้อย"
        })
    } catch (e) {
        next(e);
    }
}