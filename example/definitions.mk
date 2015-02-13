JSDOC2_INSTALLATION_PATH=/usr/share/jsdoc-toolkit
JSDOC2_TEMPLATE=../

JSDOC2=java -jar /usr/share/java/jsrun.jar \
				 $(JSDOC2_INSTALLATION_PATH)/app/run.js \
			 -t=$(JSDOC2_TEMPLATE) \
			 -d=${DATA_PATH} \
			 --define="fileName:$(shell basename $@)"

