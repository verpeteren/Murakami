ORG='libape-spidermonkey.c'
TARGET=test.js
DATA_PATH=out

all: $(TARGET)

include definitions.mk

$(TARGET): $(ORG)
	$(JSDOC2) -n -x=c,h $<

$(ORG):
	wget https://raw.github.com/verpeteren/APE_Server/master/modules/libape-spidermonkey.c

.PHONEY: clean

clean: 
	rm -rf $(ORG) $(TARGET)
