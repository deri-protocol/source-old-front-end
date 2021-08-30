import withTip from "../hoc/withTip";

function TipWrapper({renderable}){
  return renderable
}

export default withTip(TipWrapper)