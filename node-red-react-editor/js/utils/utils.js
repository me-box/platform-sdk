export function calculateTextWidth(str, className, offset) {
    let sp = document.createElement("span");
    sp.className = className;
    sp.style.position = "absolute";
    sp.style.top = "-1000px";
    sp.innerHTML = (str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    document.body.appendChild(sp);
    let w = sp.offsetWidth;
    document.body.removeChild(sp);
    return offset+w;
}