const express = require("express");
const pool = require('../../db');
const jwt = require('jsonwebtoken');
const { env_data } = require('../config/data');
const format = require('pg-format');
const joi = require('joi');

const hash = require('../hashPasswords');
const mailer = require('../misc/mailer');

const StudentSchema = require("../schemas/studentSchema");
const LoginSchema = require("../schemas/studentLoginSchema");

const studentmail = require('../mails/student/studentMail');
const passwordResetmail = require('../mails/student/studentPasswordReset');

// exports.AddNewStudent = (req, res) => {
//     pool.connect((err, client, done) => {
//         if (err) {
//             return console.log('err');
//         }
//         try {
//             const result = joi.validate(req.body, StudentSchema);
//             const token = jwt.sign({ reg_no : result.value.reg_no }, env_data.JWT_TOKEN);
//             console.log(result);
//             client.query(`INSERT INTO students(
//                                         reg_no,
//                                         index_no,
//                                         name,
//                                         email,
//                                         course,
//                                         password,
//                                         is_verified,
//                                         secretKey) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, 
//                                         [result.value.reg_no, 
//                                          result.value.index_no, 
//                                          result.value.name, 
//                                          result.value.email,
//                                          result.value.course, 
//                                          '', 
//                                          false, 
//                                          ''],
//                 (err, resp) => {
//                     client.release();
//                     if (err) {
//                         console.log(err.stack)
//                     } else {
//                         let message = '';
//                         const html = studentmail.html(token);
//                         mailer.sendEmail('admin@pdc.com', result.value.email, 'Please set your password', html).then(
//                             message = resp.rows[0]
//                         ).catch(e => console.log(e))

//                         res.send(message);
//                     }
//                 });

//         } catch (e) {
//             return e;
//         }
//     });

// }




exports.AddNewStudent = (req, res) => {
    //console.log(req.body)
    const strings = req.body;
    // const data = [
    //     ['2017CS133', '17000978', 'Oshan Mendis', 'oha@gmail.com', 1, '778908978', '3.99', '', true, 10, ''],
    //     ['2017CS134', '17000971', 'Oshan1 Mendis', 'oha1@gmail.com', 1, '778908978', '3.99', '', true, 10, ''],
    //     ['2017CS180', '17000991', 'Oshan2 Mendis', 'oha2@gmail.com', 1, '778908978', '3.49', '', true, 10, ''],
    //     ['2017CS181', '17000941', 'Oshan3 Mendis', 'oha3@gmail.com', 1, '778908978', '3.49', '', true, 10, '']
    // ]
    const dataArray = new Array()
    for(let obj of strings){
        if(obj.data[0] !== 'Reg No' && obj.data[0] !== ''){
            console.log(obj.data)
            const tempArray = [obj.data[0],obj.data[1],obj.data[2],obj.data[3],obj.data[4]==='1'?1:0,obj.data[5],obj.data[6],'',false,10,'']
            dataArray.push(tempArray)
        } else {
            continue;
        }
    }
   // console.log(strings)
    var count=0;
    pool.connect((err, client, done) => {
        if (err) {
            console.log('err');
        }
        try {
            let query1 = format('INSERT INTO students (reg_no, index_no, name, email, course, contact, current_gpa, password, is_verified, completed, secretKey) VALUES %L ON CONFLICT (reg_no) DO NOTHING returning *', dataArray);
            // const result = joi.validate(req.body[1], StudentSchema);
            // const token = jwt.sign({ reg_no : result.value.reg_no }, env_data.JWT_TOKEN);
            // console.log(result);
            client.query(query1,
(err, resp) => {
//client.release();
if (err) {
console.log(err.stack)
} else {
 let message = '';
 console.log(resp)
 //onsole.log(obj.data)
 //console.log(count++)
// const html = studentmail.html(token);
// mailer.sendEmail('admin@pdc.com', result.value.email, 'Please set your password', html).then(
//     message = resp.rows[0]
// ).catch(e => console.log(e))

res.send({message: "Success"})
}
});

//             for(let obj of strings){
//                 if(obj.data[0] !== 'Reg No' && obj.data[0] !== ''){
//                     client.query(`INSERT INTO students(
//                         reg_no,
//                         index_no,
//                         name,
//                         email,
//                         course,
//                         contact,
//                         current_gpa,
//                         password,
//                         is_verified,
//                         completed,
//                         secretKey) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (reg_no) DO NOTHING RETURNING *`, 
//                         [obj.data[0], 
//                           obj.data[1], 
//                           obj.data[2], 
//                           obj.data[3],
//                           obj.data[4]=='1'?1:0, 
//                           obj.data[5],
//                           obj.data[6],
//                           '', 
//                           true, 
//                           10,
//                           ''
//                         ],
// (err, resp) => {
//     //client.release();
//     if (err) {
//         console.log(err.stack)
//     } else {
//          let message = '';
//          console.log(obj.data)
//          //console.log(count++)
//         // const html = studentmail.html(token);
//         // mailer.sendEmail('admin@pdc.com', result.value.email, 'Please set your password', html).then(
//         //     message = resp.rows[0]
//         // ).catch(e => console.log(e))

//         res.send({message: "Success"})
//     }
//     });
//     } else {
//         continue;
//     }
//     }

    } catch (e) {
        console.log("ERROR=>"+e)
    }
    }); 
}


exports.getAllData = (req, res) => {
    pool.connect((err, client, done) => {
        if (err) res.send('error connecting to database...');
        client.query(`SELECT * FROM students`, (errp, resp) => {
            client.release();
            if (errp) {
                res.send('no user data found');
            } else {
                console.log(resp.rows)
                // var data_array = new Array()
                // for(let data of resp.rows){
                //     const array_temp = [data.name,data.reg_no,data.index_no,data.course?"CS":"IS",data.email,""]
                //     data_array.push(array_temp)
                // }
                res.send({data: resp.rows})
            }
        });

    });
}

exports.updateStudent = (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.log('err');
        }
        try {
            const result = joi.validate(req.body, StudentSchema);
            client.query(`UPDATE students SET index_no=${req.body.index_no}, reg_no='${req.body.reg_np}, name='${req.body.name}, degree=${req.body.course}, email='${req.body.email}, contact=${req.body.contact}`, 
                (err, resp) => {
                    client.release();
                    if (err) {
                        console.log(err.stack)
                    } else {
                        let message = 'Success';
                        res.send({message: message});
                    }
                });

        } catch (e) {
            return e;
        }
    }); 
}

exports.addNewStudent = (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.log('err');
        }
        try {
            const result = joi.validate(req.body, StudentSchema);
            const token = jwt.sign({ reg_no : result.value.reg_no }, env_data.JWT_TOKEN);
            console.log(result);
            client.query(`INSERT INTO students(
                                        reg_no,
                                        index_no,
                                        name,
                                        email,
                                        course,
                                        current_gpa,
                                        contact,
                                        password,
                                        is_verified,
                                        completed,
                                        secretKey) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`, 
                                        [result.value.reg_no, 
                                         result.value.index_no, 
                                         result.value.name, 
                                         result.value.email,
                                         result.value.course,
                                         result.value.gpa,  
                                         result.value.contact, 
                                         '', 
                                         false, 
                                         10,
                                         ''],
                (err, resp) => {
                    client.release();
                    if (err) {
                        console.log(err.stack)
                    } else {
                        let message = '';
                        const html = studentmail.html(token);
                        mailer.sendEmail('admin@pdc.com', result.value.email, 'Please set your password', html).then(
                            message = resp.rows[0]
                        ).catch(e => console.log(e))

                        res.send(message);
                    }
                });

        } catch (e) {
            return e;
        }
    }); 
}

exports.UpdateStudent = (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.log('err');
        }
        try {
            console.log(req.body.updatedData);
            client.query(`UPDATE students SET 
                                    interested_1  = '${req.body.updatedData.interested_1}' , 
                                    interested_2  = '${req.body.updatedData.interested_2}' ,
                                    interested_3 = '${req.body.updatedData.interested_3}' ,
                                    profile_pic_url = '${req.body.updatedData.profile_pic_url}'
                                    WHERE reg_no = '${req.body.updatedData.reg_no}' RETURNING * `, (errp, resp) => {
                            client.release();
                            if (errp) {
                                console.error(errp.stack);
                            } else {
                                if (!resp.rows[0]) {
                                    res.send('error');
                                } else {
                                    res.send('account updated successfully');
                                }
                            }
                        });
        } catch (e) {
            return e;
        }
    });

}

exports.AddProject = (req , res) =>{
    pool.connect((err, client, done) => {
        if (err) {
            return console.log('err');
        }
        // try {
            const num = req.body.data;
            console.log(num);
        //     console.log(req.body);
            
        // } catch (e) {
        //     return e;
        // }
        try {
            client.query(`INSERT INTO projects(
                                        name,
                                        description,
                                        tech_stack,
                                        link) VALUES ($1,$2,$3,$4) RETURNING *`, 
                                        [req.body.data.name, 
                                        req.body.data.desc, 
                                        req.body.data.tech, 
                                        req.body.data.link],
                (err, resp) => {
                    if (err) {
                        console.log(err.stack)
                    } else {
                        try {
                            client.query(`UPDATE students SET 
                                                    projects_${req.body.data.number} = '${resp.rows[0].id}'
                                                    WHERE reg_no = '${req.body.data.reg_no}' RETURNING * `, (errp, respp) => {

                                            client.release();
                                            if (errp) {
                                                console.error(errp.stack);
                                            } else {
                                                if (!respp.rows[0]) {
                                                    res.send('error');
                                                } else {
                                                    res.send('account updated successfully');
                                                }
                                            }
                                        });
                        } catch (e) {
                            return e;
                        }
                    }
                });

        } catch (e) {
            return e;
        }
    });
}
exports.getProject = (req,res) =>{
    pool.connect((err, client, done) => {
        if (err) {
            res.send('error connecting to database');
        }else{
            client.query(`SELECT * FROM projects WHERE id = '${req.params.id}'`, (errp, resp) => {
                client.release();
                if (errp) {
                    console.error(errp.stack);
                } else {
                    if (resp.rows[0]) {
                        res.send(resp.rows[0]);
                    } else {
                        res.send('error');
                    }
                }
            });
        }
    });
}
exports.login = (req, res) => {
    const result = joi.validate(req.body, LoginSchema);
    if (result.error) {
        res.send('data validation faild');
    } else {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            client.query(`SELECT password , is_verified FROM students WHERE reg_no = '${req.body.reg_no}'`, (errp, resp) => {
                client.release();
                if (errp) {
                    res.send('no user data found');
                } else {
                    if (resp.rows[0]) {
                        if(!resp.rows[0].is_verified){
                            res.send('not verified');
                        }else{
                            hash.comparePasswords(req.body.password, resp.rows[0].password).then(
                                resopnd => {
                                    if (resopnd) {
                                        const token = jwt.sign({ id: req.body.reg_no }, env_data.JWT_TOKEN)
                                        res.send(token);
                                    } else {
                                        res.send('incorrect password');
                                    }
                                }
                            )
                        }

                    } else {
                        res.send('no user data found');
                    }
                }
            });

        });
    }
}

exports.setPassword = (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            res.send('error connecting to database');
        }
        hash.hashPassword(req.body.password).then(
            (hashedPass) => { 
                const verified = jwt.verify(req.body.token, env_data.JWT_TOKEN);
                console.log(verified);
                client.query(`UPDATE students SET password = '${hashedPass}' , is_verified = 'true' WHERE reg_no = '${verified.reg_no}' RETURNING *`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        console.error(errp.stack);
                    } else {
                        if (!resp.rows[0]) {
                            res.send('invalid');
                        } else {
                            res.send('password set successfully');
                        }
                    }
                });
        }).catch((e)=>{res.send('error');})  
    });
}

exports.getStudentData = (req , res) =>{
    pool.connect((err, client, done) => {
        if (err) {
            res.send('error connecting to database');
        }else{
            const verified = jwt.verify(req.body.token, env_data.JWT_TOKEN);
            client.query(`SELECT * FROM students WHERE reg_no = '${verified.id}'`, (errp, resp) => {
                client.release();
                if (errp) {
                    console.error(errp.stack);
                } else {
                    if (resp.rows[0]) {
                        res.send(resp.rows[0]);
                    } else {
                        res.send('unauthorized');
                    }
                }
            });
        }
    });
}

exports.forgotPassword = (req, res) => {
    const token = jwt.sign({ reg_no : req.body.reg_no }, env_data.JWT_TOKEN);
    const html = passwordResetmail.html(token);
    pool.connect((err, client, done) => {
        if (err) res.send('error connecting to database...');
        client.query(`SELECT email FROM students WHERE reg_no = '${req.body.reg_no}'`, (errp, resp) => {
            client.release();
            if (errp) {
                res.status(400).send('no user data found');
            } else {
                if (resp.rows[0]) {
                    mailer.sendEmail('admin@pdc.com', resp.rows[0].email , 'You have requested to reset your password', html).then(
                        res.send(resp.rows[0])
                    ).catch(e => console.log(e));
                } else {
                    res.status(400).send('no user data found');
                }
            }
        });

    });
}