'use client'
export default function Home() {

 const  handleOnClick = () => {
    fetch(process.env.BACKEND_SERVER_URL+"/test")
      .then((response) => response.json())
      .then((data) => console.log(data));
  }
  return (
    <div className="flex justify-center items-center h-screen bg-black" onClick={handleOnClick}>
      TEST
    </div>
  );
}
