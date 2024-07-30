import Header from "../_components/header";
// import { redirect } from "next/navigation";

export default async function Anypath({ params }: { params: { anypath: string } }) {
  const {anypath} = params;
  console.log("anypath:", anypath);

  // If the path exists in the filesystem, it will be rendered.
  // If not, the user will be redirected to this [...anypath] file.

  // may redirect to other pages conditonally
  const routes ={
    "test": "/about",
    "test/deep": "/about/company",
    "test/even/deeper": "/about/company/another"
  }
  // redirect(anypath.join("/"));

  return (
    <>
      <Header />
      <h1>Any path</h1>
      <p><b>Array param "anypath":</b> {JSON.stringify(anypath, null, 2)}</p>
      {/* @ts-ignore */}
      <p><b>Pathname:</b> {anypath.join("/")}</p>
    </>
  );
}
