use smcrypto::{sm2, sm4};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

macro_rules! log {
    ($($t:tt)*) => (crate::log(&("[C]".to_string() + &format_args!($($t)*).to_string())))
  }

#[wasm_bindgen]
pub fn set_panic_hook() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub fn set_wasm_panic_hook() {
    set_panic_hook();
}

#[wasm_bindgen]
pub struct SM2_KEYS {
    #[wasm_bindgen(getter_with_clone)]
    pub private_key: String,
    #[wasm_bindgen(getter_with_clone)]
    pub public_key: String,
}

#[wasm_bindgen]
pub fn sm2_gen_keypair() -> SM2_KEYS {
    let (sk, pk) = sm2::gen_keypair();
    SM2_KEYS {
        public_key: pk,
        private_key: sk,
    }
}

#[wasm_bindgen]
pub fn sm2_encrypt_c1c2c3(pk: &str, buffer: &[u8]) -> Vec<u8> {
    let enc_ctx = sm2::Encrypt::new(pk);
    enc_ctx.encrypt_c1c2c3(buffer)
}

#[wasm_bindgen]
pub fn sm2_encrypt_c1c3c2(pk: &str, buffer: &[u8]) -> Vec<u8> {
    let enc_ctx = sm2::Encrypt::new(pk);
    enc_ctx.encrypt(buffer)
}

#[wasm_bindgen]
pub fn sm2_decrypt_c1c2c3(sk: &str, buffer: &[u8]) -> Vec<u8> {
    let enc_ctx = sm2::Decrypt::new(sk);
    enc_ctx.decrypt_c1c2c3(buffer)
}

#[wasm_bindgen]
pub fn sm2_decrypt_c1c3c2(sk: &str, buffer: &[u8]) -> Vec<u8> {
    let enc_ctx = sm2::Decrypt::new(sk);
    enc_ctx.decrypt(buffer)
}

#[wasm_bindgen]
pub fn sm4_encrypt_ecb(k: &[u8], buffer: &[u8]) -> Vec<u8> {
    let sm4_ecb = sm4::CryptSM4ECB::new(k);
    sm4_ecb.encrypt_ecb(buffer)
}

#[wasm_bindgen]
pub fn sm4_encrypt_cbc(k: &[u8], iv: &[u8], buffer: &[u8]) -> Vec<u8> {
    let sm4_cbc = sm4::CryptSM4CBC::new(k, iv);
    sm4_cbc.encrypt_cbc(buffer)
}

#[wasm_bindgen]
pub fn sm4_decrypt_ecb(k: &[u8], buffer: &[u8]) -> Vec<u8> {
    let sm4_ecb = sm4::CryptSM4ECB::new(k);
    sm4_ecb.decrypt_ecb(buffer)
}

#[wasm_bindgen]
pub fn sm4_decrypt_cbc(k: &[u8], iv: &[u8], buffer: &[u8]) -> Vec<u8> {
    let sm4_cbc = sm4::CryptSM4CBC::new(k, iv);
    sm4_cbc.decrypt_cbc(buffer)
}
