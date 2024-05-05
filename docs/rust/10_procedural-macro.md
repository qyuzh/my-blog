---
tags:
  - rust
  - procedural macro
---

# Rust - Procedural Macro

## What is Procedural Macro?

Procedural macros allow creating syntax extensions as execution of a function.  Procedural macros come in one of three flavors:

- Function-like macros - `custom!(...)`
- Derive macros - `#[derive(CustomDerive)]`
- Attribute macros - `#[CustomAttribute]`

Refer to [Rust Reference - Procedural Macro](https://doc.rust-lang.org/reference/procedural-macros.html#function-like-procedural-macros)

## What can it do?

1. [Builder](https://crates.io/crates/derive_builder)

## How to write one?

Refer to [proc-macro-workshop](https://github.com/dtolnay/proc-macro-workshop)

### Definition

```rust
//! in derive_builder package
use proc_macro2::{Ident, Span};
use quote::quote;
use syn::{parse_macro_input, Data, DeriveInput, Fields, Type, Visibility};

type CustomFields<'a> = (&'a Visibility, &'a Option<Ident>, &'a Type);

#[proc_macro_derive(Builder)]
pub fn derive(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse_macro_input!(input as DeriveInput);

    let struct_name = input.ident;
    let fields = get_fields(&input.data);

    let builder_name = gen_builder_name(&struct_name);
    let builder_body = gen_builder_body(&fields);
    let builder_init = gen_builder_init(&fields);
    let builder_impl_setter = gen_builder_impl_setter(&fields);
    let builder_impl_build = gen_builder_impl_build(&fields);
    let builder_impl_build_ok = gen_builder_impl_build_ok(&fields);

    let ret = quote! {
        impl #struct_name {
            pub fn builder() -> #builder_name {
                #builder_name {
                    #builder_init
                }
            }
        }

        pub struct #builder_name {
            #builder_body
        }

        impl #builder_name {
            #builder_impl_setter

            fn build(&mut self) -> Result<#struct_name, &'static str> {
                #builder_impl_build

                Ok(#struct_name {
                    #builder_impl_build_ok
                })
            }
        }
    };

    proc_macro::TokenStream::from(ret)
}

fn get_fields(data: &Data) -> Vec<CustomFields> {
    match *data {
        Data::Struct(ref data) => match data.fields {
            Fields::Named(ref fields) => fields
                .named
                .iter()
                .map(|f| (&f.vis, &f.ident, &f.ty))
                .collect(),
            _ => unimplemented!(),
        },
        _ => unimplemented!(),
    }
}

fn gen_builder_name(struct_name: &Ident) -> Ident {
    Ident::new(&format!("{}Builder", struct_name), Span::call_site())
}

fn gen_builder_body(fields: &[CustomFields]) -> proc_macro2::TokenStream {
    let ret = fields.iter().map(|(vis, ident, ty)| {
        quote! {
            #vis #ident: Option<#ty>
        }
    });

    quote! {
        #( #ret, )*
    }
}

fn gen_builder_init(fields: &[CustomFields]) -> proc_macro2::TokenStream {
    let ret = fields.iter().map(|(_, ident, _)| {
        quote! {
            #ident: None
        }
    });

    quote! {
        #( #ret, )*
    }
}

fn gen_builder_impl_setter(fields: &[CustomFields]) -> proc_macro2::TokenStream {
    let ret = fields.iter().map(|(_, ident, ty)| {
        quote! {
            fn #ident (&mut self, #ident: #ty) -> &mut Self {
                self.#ident = Some(#ident);
                self
            }
        }
    });
    quote! {
        #( #ret )*
    }
}

fn gen_builder_impl_build(fields: &[CustomFields]) -> proc_macro2::TokenStream {
    let ret = fields.iter().map(|(_, ident, _)| {
        let msg = format!("{} is not set", ident.as_ref().unwrap());
        quote! {
            if self.#ident.is_none() {
                return Err(#msg);
            }
            let #ident = self.#ident.take().unwrap();
        }
    });

    quote! {
        #( #ret )*
    }
}

fn gen_builder_impl_build_ok(fields: &[CustomFields]) -> proc_macro2::TokenStream {
    let ret = fields.iter().map(|(_, ident, _)| {
        quote! {
            #ident
        }
    });

    quote! {
        #( #ret, )*
    }
}
```

### Usage

```rust
use derive_builder::Builder;

#[derive(Builder)]
pub struct Command {
    executable: String,
    args: Vec<String>,
    env: Vec<String>,
    current_dir: String,
}

fn main() {
    let mut builder = Command::builder();
    builder.executable("cargo".to_owned());
    builder.args(vec!["build".to_owned(), "--release".to_owned()]);
    builder.env(vec![]);
    builder.current_dir("..".to_owned());

    let command = builder.build().unwrap();
    assert_eq!(command.executable, "cargo");
}
```
