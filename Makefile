setup:
	npm add -D vitepress
	npm i vitepress-plugin-mermaid mermaid -D
	npm i vitepress-plugin-tabs -D

WANAKU_ROUTER_VERSION=0.2.0
WANAKU_DEMOS_VERSION=0.2.0
WCJSDK_VERSION=0.2.2
CAMEL_INTEGRATION_CAPABILITY_VERSION=0.2.0

DEMOS_DIR=docs/demos
VERSIONS_DIR=docs/version
WCJSDK_DIR=docs/java-sdk
CAMEL_INTEGRATION_CAPABILITY_DIR=docs/camel-integration-capability

.PHONY: docs demos

router-current:
	@if [ ! -e $(VERSIONS_DIR)/wanaku-current ]; then \
		git clone --branch wanaku-$(WANAKU_ROUTER_VERSION) https://github.com/wanaku-ai/wanaku $(VERSIONS_DIR)/wanaku-current ; \
	fi

router-main:
	@if [ ! -e $(VERSIONS_DIR)/wanaku-main ]; then \
		git clone --branch main https://github.com/wanaku-ai/wanaku $(VERSIONS_DIR)/wanaku-main ; \
	fi

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

wcjsdk-main:
	@if [ ! -e $(WCJSDK_DIR)/wanaku-capabilities-java-sdk-main ]; then \
		git clone --branch main https://github.com/wanaku-ai/wanaku-capabilities-java-sdk $(WCJSDK_DIR)/wanaku-capabilities-java-sdk-main ; \
	fi

wanaku-capabilities-java-sdk: wcjsdk-current wcjsdk-main

cic-current:
	@if [ ! -e $(CAMEL_INTEGRATION_CAPABILITY_DIR)/camel-integration-capability-current ]; then \
		git clone --branch camel-integration-capability-$(CAMEL_INTEGRATION_CAPABILITY_VERSION) https://github.com/wanaku-ai/camel-integration-capability $(CAMEL_INTEGRATION_CAPABILITY_DIR)/camel-integration-capability-current ; \
	fi

cic-main:
	@if [ ! -e $(CAMEL_INTEGRATION_CAPABILITY_DIR)/camel-integration-capability-main ]; then \
		git clone --branch main https://github.com/wanaku-ai/camel-integration-capability $(CAMEL_INTEGRATION_CAPABILITY_DIR)/camel-integration-capability-main ; \
	fi

camel-integration-capability: cic-current cic-main

get-wanaku:
	curl -sSL -o get-wanaku.sh https://raw.githubusercontent.com/wanaku-ai/wanaku/refs/heads/main/get-wanaku.sh

fetch: router-current router-main demos camel-integration-capability wanaku-capabilities-java-sdk get-wanaku

docs: fetch
	npm run docs:build

clean:
	@rm -rf $(VERSIONS_DIR)/wanaku-current $(VERSIONS_DIR)/wanaku-main
	@rm -rf $(DEMOS_DIR)/wanaku-demos-current $(DEMOS_DIR)/wanaku-demos-main
	@rm -rf $(WCJSDK_DIR)/wanaku-capabilities-java-sdk-current $(WCJSDK_DIR)/wanaku-capabilities-java-sdk-main
	@rm -rf $(CAMEL_INTEGRATION_CAPABILITY_DIR)/camel-integration-capability-current $(CAMEL_INTEGRATION_CAPABILITY_DIR)/camel-integration-capability-main
	@rm -rf dist
	@rm -f get-wanaku.sh

serve:
	npm run docs:dev
