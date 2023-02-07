OUTDIR ?= "/tmp"

build-local:
	./_build/build-local.bash

cache-deps:
	deno cache --lock=deps-lock.json --lock-write --import-map=import_map.json deps.ts

deps:
	deno cache --lock=deps-lock.json deps.ts

test:
	deno test --allow-write --allow-read --allow-net --allow-env --allow-run

build-linux-x86_64: deps
	$(eval OUTFILE ?= render-linux-x86_64)
	deno compile \
		--unstable \
		--allow-net \
		--allow-read \
		--allow-run \
		--allow-write \
		--allow-env \
		--target=x86_64-unknown-linux-gnu \
		--output=${OUTDIR}/${OUTFILE} \
		./entry-point.ts

build-macos-x86_64: deps
	$(eval OUTFILE ?= render-macos-x86_64)
	deno compile \
		--unstable \
		--allow-net \
		--allow-read \
		--allow-run \
		--allow-write \
		--allow-env \
		--target=x86_64-apple-darwin \
		--output=${OUTDIR}/${OUTFILE} \
		./entry-point.ts

build-macos-aarch64: deps
	$(eval OUTFILE ?= render-macos-aarch64)
	deno compile \
		--unstable \
		--allow-net \
		--allow-read \
		--allow-run \
		--allow-write \
		--allow-env \
		--target=aarch64-apple-darwin \
		--output=${OUTDIR}/${OUTFILE} \
		./entry-point.ts

build-windows-x86_64: deps
	$(eval OUTFILE ?= render-windows-x86_64)
	deno compile \
		--unstable \
		--allow-net \
		--allow-read \
		--allow-run \
		--allow-write \
		--allow-env \
		--target=x86_64-pc-windows-msvc \
		--output=${OUTDIR}/${OUTFILE} \
		./entry-point.ts

build-completions: build-local
	mkdir -p ./share/fish/vendor_completions.d ./share/bash/bash_completion.d ./share/zsh/site-functions
	./bin/render completions fish > ./share/fish/vendor_completions.d/render.fish
	./bin/render completions bash > ./share/bash/bash_completion.d/render.bash
	./bin/render completions zsh > ./share/zsh/site-functions/render.zsh
