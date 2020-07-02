module.exports = {
    html(token) {
        const body = `WELCOME to PDC of UCSC<br/>
                        <br/><h2> Please verify your email </h2>
                        <br/>
                        <p>your secret key : ${token}</p>
                        <br/>
                        <p>proceed with this link</p>
                        <br/>
                        <h6>Thank you !!!</h6>
                        `
        return body;
    }
}