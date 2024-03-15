// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenvy::dotenv;
use serde::{Serialize, Deserialize};
use owm_rs::owm_api::{get_city_coordinates, get_weather_by_coordinates};

#[derive(Deserialize)]
pub struct Credentials {
    pub omw_api_key: String,
    pub city_name: String,
}

#[derive(Serialize)]
struct Weather {
    id: u32,
    main: String,
    description: String,
    icon: String,
}

#[derive(Serialize)]
struct WeatherRequestAnswer {
    // more: AnyData,
    temp_c: f32,
    temp_f: f32,
    place: String,
    country: String,
    more: Vec<Weather>
}


pub fn read_credentials() -> Credentials {
    let _ = dotenv().expect("Cannot load the .env file.");
    Credentials {
        omw_api_key: std::env::var("OWM_API_KEY").expect("Cannot load the OWM_API_KEY env var."),
        city_name: std::env::var("CITY").expect("Cannot load the CITY env var."),
    }
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn request_weather_info(geo: String) -> Result<WeatherRequestAnswer, String> {

    let default_geo = "london".to_string(); // Значение по умолчанию
    let geo = if geo.is_empty() { default_geo } else { geo };
    
    // format!("Hello, {}! You've been greeted from Rust!", name)
    println!("Requested weather info for {}", &geo);

    let credentials = read_credentials();
    let coords_result = get_city_coordinates(
        geo.clone(),
        credentials.omw_api_key.clone(),
    ).await;

    let coordinates = match coords_result {
        Ok(ok) => ok,
        Err(err) => {
            println!("Error trying to retrieve coordinates: {err}");
            std::process::exit(1);
        }
    };

    let weather_result = get_weather_by_coordinates(
        coordinates.get_latitude(),
        coordinates.get_longitude(),
        credentials.omw_api_key,
    ).await;

    let weather = match weather_result {
        Ok(ok) => ok,
        Err(err) => {
            println!("Error trying to retrieve the weather: {err}");
            std::process::exit(2);
        }
    };

    let temp: f32 = weather.main.temp;
    let temp_c: f32 = owm_rs::owm_utils::convert::kelvin_to_celsius(temp);
    let temp_f: f32 = owm_rs::owm_utils::convert::kelvin_to_fahrenheit(temp);

    println!(
        "It is {:.2}°C ({:.2}°F) in {}.",
        temp_c, temp_f, geo
    );

    // Ok("Requested weather info for".into())
    Ok(WeatherRequestAnswer {
        temp_c,
        temp_f,
        place: geo,
        country: weather.sys.country,
        more: weather.weather.into_iter().map(|w| Weather {
            id: w.id,
            main: w.main,
            description: w.description,
            icon: w.icon,
        }).collect()
    })
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![request_weather_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
