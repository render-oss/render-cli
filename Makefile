OUTDIR := "/tmp"

cache-deps:
	deno cache --lock=deps-lock.json --lock-write --import-map=import_map.json deps.ts

deps:
	deno cache --lock=deps-lock.json deps.ts

build-linux-x86_64: deps
	deno compile --unstable --allow-net --allow-read --allow-run --allow-write --allow-env --target=x86_64-unknown-linux-gnu --output=${OUTDIR}/render-linux-x86_64 ./entry-point.ts

build-macos-x86_64: deps
	deno compile --unstable --allow-net --allow-read --allow-run --allow-write --allow-env --target=x86_64-apple-darwin --output=${OUTDIR}/render-macos-x86_64 ./entry-point.ts

build-macos-aarch64: deps
	deno compile --unstable --allow-net --allow-read --allow-run --allow-write --allow-env --target=aarch64-apple-darwin --output=${OUTDIR}/render-macos-aarch64 ./entry-point.ts

build-windows-x86_64: deps
	deno compile --unstable --allow-net --allow-read --allow-run --allow-write --allow-env --target=x86_64-pc-windows-msvc --output=${OUTDIR}/render-windows-x86_64 ./entry-point.ts