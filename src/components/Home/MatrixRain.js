import { useRef ,useEffect} from "react"
import './matrix-rain.less'
import moment from 'moment'

export default function MatrixRain({lang}){
  const canvasRef = useRef(null)
  
  useEffect(() => {
    // var c = canvasRef.current;
    // var ctx = canvasRef.current.getContext("2d");

    

    // const rect = c.getBoundingClientRect();
    // c.height = rect.height;
    // c.width = window.innerWidth;

    // var greece = 'Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ ς σ τ υ φ χ ψ ω'
    // var greecea = 'Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ ς σ τ υ φ χ ψ ω'
    // var greeceb = 'Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ ς σ τ υ φ χ ψ ω'
    // var hex = "0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101"
    var canvas = canvasRef.current,
    ctx = canvas.getContext('2d');

    // Setting the width and height of the canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = window.innerWidth;
    canvas.height = rect.height;

    // Setting up the letters
    var letters = 'Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101 Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ ς σ τ υ φ χ ψ ωΑ Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ ς σ τ υ φ χ ψ ω';
    letters = letters.split('');

    // Setting up the columns
    var fontSize = 14,
        columns = canvas.width / fontSize;

    // Setting up the drops
    var drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    // Setting up the draw function
    function draw() {
      ctx.fillStyle = 'rgba(13, 14, 16, .1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < drops.length; i++) {
        var text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = '#0f0';

        ctx.font = fontSize + "px arial";
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
          drops[i] = 0;
        }
      }
    }

    // Loop the animation
    setInterval(draw, 100);
  }, [])
  return (
    <canvas ref={canvasRef}>
    </canvas>
  )
}