use ic_cdk::api::{
    stable::{stable_grow, stable_size, stable_write},
    trap,
};

const EMPTY_SALT: [u8; 32] = [0; 32];

pub type Salt = [u8; 32];

/// Data type responsible for managing user data in stable memory.
pub struct Storage {
    header: Header,
}

#[repr(packed)]
struct Header {
    salt: [u8; 32],
}

impl Storage {
    /// Creates a new empty storage that manages the data of users in
    /// the specified range.
    pub fn new() -> Self {
        Self {
            header: Header { salt: EMPTY_SALT },
        }
    }

    pub fn salt(&self) -> Option<&Salt> {
        if self.header.salt == EMPTY_SALT {
            None
        } else {
            Some(&self.header.salt)
        }
    }

    pub fn update_salt(&mut self, salt: Salt) {
        if self.salt().is_some() {
            trap("Attempted to set the salt twice.");
        }
        self.header.salt = salt;
        self.flush();
    }

    /// Make sure all the required metadata is recorded to stable memory.
    pub fn flush(&self) {
        if stable_size() < 1 {
            let result = stable_grow(1);
            if result.is_err() {
                trap("failed to grow stable memory by 1 page");
            }
        }
        unsafe {
            let slice = std::slice::from_raw_parts(
                &self.header as *const _ as *const u8,
                std::mem::size_of::<Header>(),
            );
            stable_write(0, &slice);
        }
    }
}
