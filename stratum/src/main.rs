// Copyright 2018 Blade M. Doyle
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//! Mining Stratum Pool

#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate bufstream;
#[macro_use]
extern crate log;
extern crate time;
extern crate log4rs;
extern crate toml;
extern crate reqwest;
extern crate redis;
extern crate blake2_rfc as blake2;
extern crate byteorder;
extern crate rand;
extern crate queues;
extern crate mwc_core;
extern crate mwc_util;
extern crate failure;
extern crate backtrace;

use std::io::BufRead;
use std::io::{ErrorKind, Write};
use std::net::{TcpListener, TcpStream};
use std::sync::{Arc, Mutex, RwLock};
use std::thread;
use std::time::Duration;
use std::time::SystemTime;

mod pool;
use pool::config;
use pool::pool::Pool;
use pool::logger::init_logger;

fn main() {

    init_logger();

    warn!("Startng MWC-Pool");

    let config = config::read_config();

    println!("{:?}", config);

    let mut my_pool = Pool::new(config);
    my_pool.run();
}
