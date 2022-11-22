function validate(e)
{
    let pickup = document.forms["srch"]["pickup"];
    let dest = document.forms["srch"]["dest"];
    let error = document.getElementById("error");
    if(pickup.value == dest.value)
    {   e.preventDefault();
        // alert("Same Location")
        error.innerText = "Same Location"
        error.style.color = "red";

    }
}
