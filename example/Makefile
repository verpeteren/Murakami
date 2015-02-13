ORG=libape-spidermonkey.c
DATA_PATH=./www/static/js
TARGET=$(DATA_PATH)/data.js

all: $(TARGET)

include definitions.mk

$(TARGET): $(ORG)
	$(JSDOC2) -n -x=c,h $<

./tmp/$(ORG): 
	wget -q https://raw.github.com/verpeteren/APE_Server/master/modules/$(ORG) -O $@

.PHONY: clean

clean: 
	rm -rf ./tmp/$(ORG) $(TARGET)
