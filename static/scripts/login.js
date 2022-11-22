function validate(e)
{
    let name = document.getElementById("userName").value;
    let pass = document.getElementById("passWord").value;
    if(name == "" || pass == "")
    {
        e.preventDefault()
        document.getElementById("error").innerText = "Please Enter Details";
    }
    else{
        document.getElementById("error").innerText = "";
    } 
}