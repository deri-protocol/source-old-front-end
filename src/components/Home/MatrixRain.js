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
    var letters = 'ΑΒΓΔΕΖΗΘΙΚΛΜ0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101ΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρςστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρςστυφχψω';
    letters = letters.split('');

    // Setting up the columns
    var fontsSizes = [24,18,14]
    var fontSize = fontsSizes[0],
        columns = canvas.width / fontSize;

    // Setting up the drops
    var drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = 1;
    }
    var random = 0
    var selectedColumns= []
    var selectedFontSize = fontsSizes[Math.floor(Math.random() * fontsSizes.length)]
    for (let i = 0 ; i < Math.floor(columns / 0.8) ; i++){
      selectedColumns.push(Math.floor(Math.random() * columns))
    }
    // Setting up the draw function
    function draw() {
      ctx.fillStyle = 'rgba(13, 14, 16, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < drops.length; i++) {
        var text = letters[Math.floor(Math.random() * letters.length)];
        if(selectedColumns.includes(i)){
          ctx.font = selectedFontSize + 'px arial'
          ctx.fillStyle = '#0068A3';
        } else {
          ctx.fillStyle = 'rgb(36,108,173)';
          ctx.font = fontSize + "px arial";
          random = 1
        }
        ctx.fillText(text, i * fontSize + random, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > .97) {
          drops[i] = 0;
          if(selectedColumns.includes(i)){
            var pos = selectedColumns.indexOf(i);
            random = random + Math.floor(Math.random() * selectedFontSize)
            selectedColumns.splice(pos,1,Math.floor(Math.random() * columns))
            // selectedFontSize = fontsSizes[Math.floor(Math.random() * fontsSizes.length)]
          }
        }
      }
    }

    // Loop the animation
    setInterval(draw, 33);
  }, [])
  return (
    <canvas ref={canvasRef}>
    </canvas>
  )
}