setup:
	npm add -D vitepress
	npm i vitepress-plugin-mermaid mermaid -D
	npm i vitepress-plugin-tabs -D

WANAKU_CLASSIC_VERSION=0.2.0
WANAKU_BARN_VERSION=0.2.0
WANAKU_DEMOS_VERSION=0.2.0
WCJSDK_VERSION=0.2.2
CAMEL_INTEGRATION_CAPABILITY_VERSION=0.2.0

DEMOS_DIR=docs/demos
WANAKU_CLASSIC_DIR=docs/classic
WANAKU_NEXT_DIR=docs/next
BARN_DIR=docs/barn
WCJSDK_DIR=docs/java-sdk
CAMEL_INTEGRATION_CAPABILITY_DIR=docs/camel-integration-capability
SEMANTIC_ROUTER_DIR=docs/semantic-router

.PHONY: docs demos

# The wanaku targets publish only the docs/ folder of the cloned ref, so the URL path is the path under docs/
wanaku-classic:
	@if [ ! -e $(WANAKU_CLASSIC_DIR) ]; then \
		tmp=$$(mktemp -d) && trap 'rm -rf "$$tmp"' EXIT && \
		git clone --depth 1 --branch wanaku-$(WANAKU_CLASSIC_VERSION) https://github.com/wanaku-ai/wanaku "$$tmp" && \
		mv "$$tmp/docs" $(WANAKU_CLASSIC_DIR) ; \
	fi

wanaku-next:
	@if [ ! -e $(WANAKU_NEXT_DIR) ]; then \
		tmp=$$(mktemp -d) && trap 'rm -rf "$$tmp"' EXIT && \
		git clone --depth 1 --branch main https://github.com/wanaku-ai/wanaku "$$tmp" && \
		mv "$$tmp/docs" $(WANAKU_NEXT_DIR) ; \
	fi

barn-current:
	@if [ ! -e $(BARN_DIR)/wanaku-barn-current ]; then \
		git clone --branch wanaku-$(WANAKU_BARN_VERSION) https://github.com/wanaku-ai/wanaku-barn $(BARN_DIR)/wanaku-barn-current ; \
	fi

# Like wanaku-next, barn-next publishes only the docs/ folder of Barn main
barn-next:
	@if [ ! -e $(BARN_DIR)/next ]; then \
		tmp=$$(mktemp -d) && trap 'rm -rf "$$tmp"' EXIT && \
		git clone --depth 1 --branch main https://github.com/wanaku-ai/wanaku-barn "$$tmp" && \
		mv "$$tmp/docs" $(BARN_DIR)/next ; \
	fi

barn: barn-current barn-next

demos-current:
	@if [ ! -e $(DEMOS_DIR)/wanaku-demos-current ]; then \
		git clone --branch wanaku-demos-$(WANAKU_DEMOS_VERSION) https://github.com/wanaku-ai/wanaku-demos $(DEMOS_DIR)/wanaku-demos-current ; \
	fi

demos-main:
	@if [ ! -e $(DEMOS_DIR)/wanaku-demos-main ]; then \
		git clone --branch main https://github.com/wanaku-ai/wanaku-demos $(DEMOS_DIR)/wanaku-demos-main ; \
	fi

demos: demos-current demos-main

wcjsdk-current:
	@if [ ! -e $(WCJSDK_DIR)/wanaku-capabilities-java-sdk-current ]; then \
		git clone --branch wanaku-capabilities-java-sdk-$(WCJSDK_VERSION) https://github.com/wanaku-ai/wanaku-capabilities-java-sdk $(WCJSDK_DIR)/wanaku-capabilities-java-sdk-current ; \
	fi

# Like wanaku-next, wcjsdk-next publishes only the docs/ folder of the SDK main
wcjsdk-next:
	@if [ ! -e $(WCJSDK_DIR)/next ]; then \
		tmp=$$(mktemp -d) && trap 'rm -rf "$$tmp"' EXIT && \
		git clone --depth 1 --branch main https://github.com/wanaku-ai/wanaku-capabilities-java-sdk "$$tmp" && \
		mv "$$tmp/docs" $(WCJSDK_DIR)/next ; \
	fi

wanaku-capabilities-java-sdk: wcjsdk-current wcjsdk-next

# The Semantic Router has no release yet, so only the docs/ folder of its main is published
semantic-router-next:
	@if [ ! -e $(SEMANTIC_ROUTER_DIR)/next ]; then \
		tmp=$$(mktemp -d) && trap 'rm -rf "$$tmp"' EXIT && \
		git clone --depth 1 --branch main https://github.com/wanaku-ai/wanaku-semantic-router "$$tmp" && \
		mkdir -p $(SEMANTIC_ROUTER_DIR) && mv "$$tmp/docs" $(SEMANTIC_ROUTER_DIR)/next ; \
	fi

cic-current:
	@if [ ! -e $(CAMEL_INTEGRATION_CAPABILITY_DIR)/camel-integration-capability-current ]; then \
		git clone --branch camel-integration-capability-$(CAMEL_INTEGRATION_CAPABILITY_VERSION) https://github.com/wanaku-ai/camel-integration-capability $(CAMEL_INTEGRATION_CAPABILITY_DIR)/camel-integration-capability-current ; \
	fi

# Like wanaku-next, cic-next publishes only the docs/ folder of the CIC main
cic-next:
	@if [ ! -e $(CAMEL_INTEGRATION_CAPABILITY_DIR)/next ]; then \
		tmp=$$(mktemp -d) && trap 'rm -rf "$$tmp"' EXIT && \
		git clone --depth 1 --branch main https://github.com/wanaku-ai/camel-integration-capability "$$tmp" && \
		mv "$$tmp/docs" $(CAMEL_INTEGRATION_CAPABILITY_DIR)/next ; \
	fi

camel-integration-capability: cic-current cic-next

get-wanaku:
	curl -fsSL -o get-wanaku.sh https://raw.githubusercontent.com/wanaku-ai/wanaku/refs/heads/main/get-wanaku.sh

fetch: wanaku-classic wanaku-next barn demos camel-integration-capability wanaku-capabilities-java-sdk semantic-router-next get-wanaku

docs: fetch
	npm run docs:build

clean:
	@rm -rf $(WANAKU_CLASSIC_DIR) $(WANAKU_NEXT_DIR) docs/version
	@rm -rf $(BARN_DIR)/wanaku-barn-current $(BARN_DIR)/next
	@rm -rf $(DEMOS_DIR)/wanaku-demos-current $(DEMOS_DIR)/wanaku-demos-main
	@rm -rf $(WCJSDK_DIR)/wanaku-capabilities-java-sdk-current $(WCJSDK_DIR)/next
	@rm -rf $(SEMANTIC_ROUTER_DIR)/next
	@rm -rf $(CAMEL_INTEGRATION_CAPABILITY_DIR)/camel-integration-capability-current $(CAMEL_INTEGRATION_CAPABILITY_DIR)/next
	@rm -rf dist
	@rm -f get-wanaku.sh

serve:
	npm run docs:dev
