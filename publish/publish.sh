#!/usr/bin/env bash

which dirname &> /dev/null || die "Unable to run dirname command - please install it"
export SCRIPTNAME="publish.sh"
export SCRIPT_DIR=$(dirname "$(readlink -f "$0")") || { echo "Unable to identify basedir from $0" ; exit 1; }
. "${SCRIPT_DIR}/shared.sh" || { echo "Unable to load shared file shared.sh" ; exit 1; }

DESTDIR=${1}

test -n "${DESTDIR}" || die "Usage: $0 <destinationdir>"
info "Installing into ${DESTDIR}"

# Runs from the toplevel directory

# This is very primitive. The original layout is not very convenient, so we stuff it all together in the destination directory

# Copy the data files. No spaces allowed.
info "Copying data files"
for FILE in data/*.json; do
    cp --update ${FILE} ${DESTDIR}/ || die "Error copying ${FILE} to ${DESTDIR}"
done

info "Copying js files"
for FILE in html/*.js; do
    cp --update ${FILE} ${DESTDIR}/ || die "Error copying ${FILE} to ${DESTDIR}"
done

info "Copying index.html"
# We modify the file for now. So we always copy. Later we will do something neater.
sed 's/\.\.\/data\///' < html/index.html > ${DESTDIR}/index.html || die "Error modifying and copying index.html"

info "Done. Everything published in ${DESTDIR}"
