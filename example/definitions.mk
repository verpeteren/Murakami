JSDOC2_INSTALLATION_PATH=/opt/jsdoc_toolkit-2.4.0/jsdoc-toolkit
JSDOC2_TEMPLATE=../

JSDOC2=java -jar $(JSDOC2_INSTALLATION_PATH)/jsrun.jar \
				 $(JSDOC2_INSTALLATION_PATH)/app/run.js \
			 -t=$(JSDOC2_TEMPLATE) \
			 -d=${DATA_PATH} \
			 --define="fileName:$(shell basename $@)"

