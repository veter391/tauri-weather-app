import "./temp.scss";

function Temp({ data }) {
    const temp_c = data.temp_c.toFixed(2);
    // const place = data.place[0].toUpperCase() + data.place.slice(1);

    return (
        <>
            <p className="answer">{`${temp_c}°C`}</p>
            {/* <p className="city">{place}</p> */}
        </>
    );
}

export default Temp;