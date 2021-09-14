import { useRef ,useEffect} from "react"
import './matrix-rain.less'
import moment from 'moment'

export default function MatrixRain({lang}){
  const canvasRef = useRef(null)
  
  useEffect(() => {
    var c = canvasRef.current;
    var ctx = canvasRef.current.getContext("2d");

    

    const rect = c.getBoundingClientRect();
    c.height = rect.height;
    c.width = window.innerWidth;

    var greece = 'Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ ς σ τ υ φ χ ψ ω'
    var greecea = 'Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ ς σ τ υ φ χ ψ ω'
    var greeceb = 'Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ ς σ τ υ φ χ ψ ω'
    var hex = "0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101"
    var characters = (greece + greecea + greeceb+ hex).split("");
    var font_size = 14;
    var columns = c.width/font_size;    // number of columns for the rain
    var drops = [];
    for (var x = 0; x < columns; x++)
        drops[x] = 1;

    function getColor() {
      return 'rgba(13,14,16,0.1)';
      return "rgba(" + moment().format('HH') + ","
                  + moment().format('mm') + ","
                  + moment().format('ss')  + ", 0.05)";
    }

    function getColorHex() {
        return "#" + moment().format('HHmmss');
    }

    function draw() {
        ctx.fillStyle = getColor();
        ctx.fillRect(0, 0, c.width, c.height);

        ctx.fillStyle = "#21639e"; // grey text
        ctx.font = font_size + "px arial";

        for (var i = 0; i < drops.length; i++) {
            // a random character to print
            var text = characters[Math.floor(Math.random() * characters.length)];
            // x = i * font_size, y = value of drops[i] * font_size
            ctx.fillText(text, i * font_size, drops[i] * font_size);

            if (drops[i] * font_size > c.height && Math.random() > 0.975)
                drops[i] = 0;

            drops[i]++;
        }
    }
    setInterval(draw, 50);
  }, [])
  return (
    <canvas ref={canvasRef}>
    </canvas>
  )
}