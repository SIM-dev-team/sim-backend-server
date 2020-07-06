module.exports = {
    html(token) {
        const body = `WELCOME to PDC of UCSC<br/>
                        <br/><h2> Please verify your email </h2>
                        <br/>
                        <p>your secret key : ${token}</p>
                        <br/>
                        <p>proceed with this link</p>
                        <a href="http://localhost:3000/verify-email"> verification link<a>
                        <br/>
                        <h3>Thank you !!!</h3>
                        `
        return body;
    }
}