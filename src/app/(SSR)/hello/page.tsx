export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  //   throw Error('HIII');
  return <div>Hello, NextJS</div>;
}
