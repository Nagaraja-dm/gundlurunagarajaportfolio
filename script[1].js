const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")})},{threshold:.12});
document.querySelectorAll("section,.case,.skill,.timeline-item,.proof-card").forEach(el=>{el.classList.add("reveal");observer.observe(el)});
document.querySelector(".menu")?.addEventListener("click",()=>{document.querySelector(".nav nav").classList.toggle("mobile-open")});
