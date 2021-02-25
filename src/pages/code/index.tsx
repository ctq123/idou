
import GenerateVue from './GenerateVue'
import GenerateReact from './GenerateReact'

export default function CodePage() {
  return (
    <div style={{ marginTop: 500, marginLeft: 500 }}>
      <GenerateVue />
      <br />
      <br />
      <br />
      <GenerateReact />
    </div>
  );
}
